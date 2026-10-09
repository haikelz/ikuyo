<script lang="ts">
  import { Frame, FramePanel, FrameHeader, FrameTitle, FrameDescription, FrameFooter } from "@ikuyo/ui";
</script>

<div class="grid min-w-0 gap-6">
  <Frame data-cy="frame-default">
    <FrameHeader>
      <FrameTitle><h3 class="m-0 text-base">Default frame</h3></FrameTitle>
      <FrameDescription>Group related content without adding another card inside it.</FrameDescription>
    </FrameHeader>
    <FramePanel>Content lives in the panel. Headers and footers can sit outside it.</FramePanel>
    <FrameFooter><a href="/guestbook">See the guestbook example</a></FrameFooter>
  </Frame>
  <Frame stacked spacing="sm" data-cy="frame-stacked">
    <FrameHeader><FrameTitle><h3 class="m-0 text-base">Stacked panels</h3></FrameTitle></FrameHeader>
    <FramePanel>Connected panels share a single border.</FramePanel>
    <FramePanel>The inner corners are square; the outer corners stay concentric.</FramePanel>
  </Frame>
  <Frame variant="ghost" spacing="lg" data-cy="frame-ghost">
    <FrameHeader><FrameTitle><h3 class="m-0 text-base">Ghost frame</h3></FrameTitle></FrameHeader>
    <FramePanel>No outer border, with larger content spacing.</FramePanel>
  </Frame>
  <Frame dense stacked style="--frame-radius: 12px" data-cy="frame-dense">
    <FramePanel><h3 class="m-0 text-base">Dense frame</h3></FramePanel>
    <FramePanel>Panels sit flush with the frame. Content padding stays readable.</FramePanel>
  </Frame>
</div>
