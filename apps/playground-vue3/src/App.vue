<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { Web3Connect } from '@zanejs/vue3'

const web3Connect = ref()
onMounted(() => {
  console.log(web3Connect)

  watch(
    () => web3Connect.value.chainId,
    (val) => {
      console.log(val)
    }
  )
})
</script>
<template>
  <div class="header">
    <div class="content">
      <div class="left" />
      <div class="right">
        <Web3Connect ref="web3Connect" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 14px 32px;
  margin-right: auto;
  margin-left: auto;

  .content {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 0;
    padding: 0;

    .left {
      display: flex;
      flex-grow: 1;
      gap: 1.5rem;
      align-items: center;
    }

    .right {
      position: static;
      display: flex;
      justify-content: center;
      -webkit-box-pack: center;
      width: auto;
      min-width: 0px;
      padding: 0px 1rem;
      margin: 0;
      margin-right: 0.375rem;
      border-top-width: 0px;
    }
  }
}

@media (min-width: 600px) {
  .header {
    .content {
      min-height: 64px;
      padding-right: 24px;
      padding-left: 24px;
    }
  }
}

@media (min-width: 320px) {
  @media (orientation: landscape) {
    .header {
      .content {
        min-height: 48px;
      }
    }
  }
}
</style>
