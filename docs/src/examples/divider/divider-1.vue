<template>
  <div class="flex flex-row gap-4">
    <zane-card>
      <div class="h-[150px] p-4">
        <zane-text>Content A</zane-text>
        <zane-divider />
        <zane-text>Content B</zane-text>
      </div>
    </zane-card>

    <zane-card>
      <div class="h-[150px] p-4">
        <zane-text>Content A</zane-text>
        <zane-divider> or</zane-divider>
        <zane-text>Content B</zane-text>
      </div>
    </zane-card>

    <zane-card>
      <div class="flex h-[150px] flex-row p-4">
        <zane-text>Content A</zane-text>
        <zane-divider vertical="true" />
        <zane-text>Content B</zane-text>
      </div>
    </zane-card>

    <zane-card>
      <div class="flex h-[150px] flex-row p-4">
        <zane-text>Content A</zane-text>
        <zane-divider vertical="true"> or</zane-divider>
        <zane-text>Content B</zane-text>
      </div>
    </zane-card>
  </div>
</template>
