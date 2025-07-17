<template>
  <div class="flex flex-row items-center gap-4">
    <zane-button-group>
      <zane-button icon="home" variant="outline" color="secondary" />
      <zane-button icon="alarm" variant="outline" color="secondary" />
      <zane-button icon="box" variant="outline" color="secondary" />
    </zane-button-group>

    <zane-button-group>
      <zane-button variant="outline" color="secondary">Save</zane-button>
      <zane-dropdown>
        <zane-button
          icon="chevron--down"
          class="last-child"
          variant="outline"
          color="secondary"
          style="

--button-padding: 0.5rem"
        />
        <zane-dropdown-menu>
          <zane-menu-item value="cut">
            Cut
            <span slot="end">⌘X</span>
          </zane-menu-item>
          <zane-menu-item value="copy">
            Copy
            <span slot="end">⌘C</span>
          </zane-menu-item>
          <zane-menu-item value="paste">
            Paste
            <span slot="end">⌘X</span>
          </zane-menu-item>
          <zane-menu-divider />
          <zane-menu-item value="bold" selected="true"> Bold </zane-menu-item>
          <zane-menu-item value="italic"> Italic </zane-menu-item>
          <zane-menu-divider />
          <zane-menu-item value="delete" color="danger">
            Delete
            <zane-icon name="delete" slot="end" />
          </zane-menu-item>
        </zane-dropdown-menu>
      </zane-dropdown>
    </zane-button-group>
  </div>
</template>

<style>
.last-child {
  --zane-button-border-width: 0.0625rem;
  --zane-button-border-radius: 0 var(--border-radius, 3px) 3px
    var(--border-radius, 3px) 0;
}
</style>
