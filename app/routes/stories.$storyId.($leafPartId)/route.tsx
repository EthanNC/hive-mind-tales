import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { json, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { withZod } from "@remix-validated-form/with-zod"
import React, { Fragment } from "react"
import { ValidatedForm } from "remix-validated-form"
import { z } from "zod"
import { Button, Divider, H1, RichTextEditor, Spacer } from "~/components"
import { FormSubmitButton } from "~/components/form-submit-button"
import {
  StoryNavigator,
  StoryNavigatorNode,
} from "~/components/story-navigator"
import { TwoColumnContent } from "~/components/two-column-content"
import { Stories, StoryNode } from "~/domain/stories"
import { enhanceThread } from "./lib"

export const validator = withZod(
  z.object({
    story: z.string().min(1, { message: "Story is required" }),
    visibleInFeeds: z.enum(["on", "off"]).optional().default("off"),
  }),
)

const paramsSchema = z.object({
  storyId: z.string(),
  leafPartId: z.string().optional(),
})

export const loader = async ({ params }: LoaderArgs) => {
  const { storyId, leafPartId: threadEndPartId } = paramsSchema.parse(params)

  console.log(storyId, threadEndPartId)

  const [tree, thread] = await Promise.all([
    Stories.getTree({ storyId }),
    Stories.getThread({ storyId, threadEndPartId }),
  ])

  // TODO:
  // - Consider a caching strategy here.
  return json({ tree, thread: enhanceThread({ tree, thread }), storyId }, 200)
}

const StoryNavigateGamepad: React.FC = () => {
  return (
    <div className="relative m-auto h-32 w-28">
      <button className="absolute top-0 left-2/4 block w-9 -translate-x-1/2">
        <FontAwesomeIcon icon={faCaretUp} />
      </button>
      <button className="absolute left-2/4 bottom-0 block w-9 -translate-x-1/2">
        <FontAwesomeIcon icon={faCaretDown} />
      </button>
      <button className="absolute right-0 bottom-1/2 block h-7 w-7">
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
      <button className="absolute left-0 bottom-1/2 block h-7 w-7">
        <FontAwesomeIcon icon={faCaretLeft} />
      </button>
    </div>
  )
}

export default function StoryRoute() {
  const data = useLoaderData<typeof loader>()
  const navigate = useNavigate()

  const [showEditor, setShowEditor] = React.useState(false)

  function navigateToNode(args: { node: StoryNode }) {
    const { node } = args
    navigate(`/stories/${data.storyId}/${node.id}`)
  }

  const [selectedNode, setSelectedNode] =
    React.useState<StoryNavigatorNode | null>(null)

  const onNodeClick = React.useCallback(
    (node: StoryNavigatorNode) => {
      setSelectedNode(node)
      navigateToNode({ node: node.data })
    },
    [setSelectedNode, selectedNode],
  )

  const [root, ...collaborations] = data.thread
  const lastPart = data.thread[data.thread.length - 1]
  const parent =
    data.thread.length > 1 ? data.thread[data.thread.length - 2] : null
  const hasChildren = lastPart.node.children.length > 0
  const hasSiblings = parent ? parent.node.children.length > 1 : false

  return (
    <TwoColumnContent
      left={() => (
        <StoryNavigator
          tree={data.tree}
          thread={data.thread}
          onNodeClick={onNodeClick}
        />
      )}
      right={() => (
        <>
          <Spacer size="lg" />
          <H1>Story</H1>
          <span className="block text-xs italic text-slate-400">
            A story initiated by @{data.tree.author}.
          </span>
          <Spacer size="sm" />
          <div dangerouslySetInnerHTML={{ __html: root.part.content }} />
          {collaborations.map((collaboration) => (
            <Fragment key={collaboration.part.id}>
              <Spacer size="sm" />
              <span className="block text-right text-xs italic text-slate-400">
                Collaboration by @{collaboration.part.author};
              </span>
              <div
                dangerouslySetInnerHTML={{
                  __html: collaboration.part.content,
                }}
              />
            </Fragment>
          ))}
          <Spacer size="sm" />
          {/* <StoryNavigateGamepad /> */}

          {!showEditor && (
            <>
              <Spacer size="md" />
              <Divider
                label="Want to continue this thread?"
                hint="Click the button to add your spin"
              />
              <Spacer size="md" />
              <div className="text-center">
                <Button>Collaborate</Button>
              </div>
            </>
          )}

          {showEditor && (
            <>
              <ValidatedForm method="post" validator={validator}>
                <Spacer size="md" />
                <Divider
                  label="Continue this thread"
                  hint="Add your own spin by clicking the text below"
                />
                <Spacer size="sm" />
                <RichTextEditor
                  initialContent={"<p>The story didn't end there...</p>"}
                />
                <Spacer size="lg" />
                <div className="text-center">
                  <FormSubmitButton>Submit</FormSubmitButton>
                </div>
              </ValidatedForm>
            </>
          )}
        </>
      )}
    />
  )
}
