<template>
  <div v-if="isClient" :class="`${prefixCls}`">
    <!-- 连接钱包按钮 -->
    <ElButton
      v-if="!connected"
      type="primary"
      :style="{ minWidth: '165px' }"
      @click="chooseWalletDialogVisible = true"
    >
      {{ localeString('connect-wallet') }}
    </ElButton>
    <div v-else>
      <ElButton
        v-if="!!currentChain"
        size="large"
        text
        bg
        @click="switchNetworkDialogVisible = true"
      >
        <img
          :src="getChainIcon(currentChain.chainId)"
          height="20"
          :style="{ marginRight: '10px' }"
        />
        {{ currentChain.name }}
        <ElIcon :size="20" :style="{ marginLeft: '10px' }">
          <ArrowDown />
        </ElIcon>
      </ElButton>
      <ElButton size="large" text bg @click="accountInfoDialogVisible = true">
        <img
          :src="currentWallet?.icon"
          height="24"
          :style="{ marginRight: '10px' }"
        />
        {{ shortAccount }}
        <div
          class="dot"
          :style="{ marginLeft: '8px', width: '10px', height: '10px' }"
        />
      </ElButton>
    </div>

    <!-- 选择钱包弹窗 -->
    <ElDialog
      v-model="chooseWalletDialogVisible"
      :width="720"
      :show-close="false"
      :close-on-click-modal="false"
      :class="`${prefixCls}-choose`"
    >
      <template #header="{ close }">
        <ElButton
          type="info"
          circle
          :style="{ width: '28px', height: '28px' }"
          @click="close"
        >
          <ElIcon :size="20">
            <CloseBold />
          </ElIcon>
        </ElButton>
      </template>
      <div :class="`${prefixCls}-choose-content`">
        <div :class="`${prefixCls}-choose-content-left`">
          <div :class="`${prefixCls}-choose-content-left-title`">
            <h1>{{ localeString('connect-wallet') }}</h1>
          </div>
          <div :class="`${prefixCls}-choose-content-left-content`">
            <div :class="`${prefixCls}-choose-content-left-content-recent`">
              <span>{{ localeString('recent') }}</span>
            </div>
            <div :class="`${prefixCls}-choose-content-left-content-list`">
              <!-- wallet list start -->
              <div v-for="wallet in wallets" :key="wallet.name">
                <div
                  :class="`${prefixCls}-choose-content-left-content-list-item ${
                    currentWallet?.name == wallet.name ? 'active' : ''
                  }`"
                  @click="() => onWalletClick(wallet)"
                >
                  <img :src="wallet.icon" height="28" :alt="wallet.name" />
                  <div>{{ wallet.name }}</div>
                </div>
              </div>
              <!-- wallet list end -->
            </div>
          </div>
        </div>
        <ElDivider
          direction="vertical"
          border-style="dashed"
          :style="{ height: 'auto' }"
        />
        <div :class="`${prefixCls}-choose-content-right`">
          <div :class="`${prefixCls}-choose-content-right-content`">
            <!-- walletDesc -->
            <template v-if="state == 'walletDesc'">
              <div :class="`${prefixCls}-choose-content-right-content-title`">
                <span>{{ localeString('what-is-wallet') }}</span>
              </div>
              <div :class="`${prefixCls}-choose-content-right-content-content`">
                <div
                  v-for="item in walletDesc"
                  :key="item.title"
                  :class="`${prefixCls}-choose-content-right-content-content-item`"
                >
                  <div class="wallet-desc-icon">
                    <img
                      v-if="!!item.icon"
                      :src="item.icon"
                      :alt="item.title"
                      width="48"
                    />
                  </div>
                  <div class="wallet-desc">
                    <div class="wallet-desc-title">{{ item.title }}</div>
                    <div class="wallet-desc-desc">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </template>
            <!-- connecting -->
            <template v-else-if="state == 'connecting'">
              <div
                :class="`${prefixCls}-choose-content-right-content-connecting`"
              >
                <div
                  :class="`${prefixCls}-choose-content-right-content-connecting-content`"
                >
                  <div
                    :class="`${prefixCls}-choose-content-right-content-connecting-content-top`"
                  >
                    <img :src="currentWallet?.icon" height="60" />
                  </div>
                  <div
                    :class="`${prefixCls}-choose-content-right-content-connecting-content-center`"
                  >
                    <div
                      :class="`${prefixCls}-choose-content-right-content-connecting-content-center-opening-wallet`"
                    >
                      {{
                        localeString('opening-wallet', {
                          name: currentWallet?.name,
                        })
                      }}
                    </div>
                    <div
                      :class="`${prefixCls}-choose-content-right-content-connecting-content-center-waiting-connection`"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                          opacity=".25"
                        />
                        <path
                          fill="currentColor"
                          d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                        >
                          <animateTransform
                            attributeName="transform"
                            dur="0.75s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;360 12 12"
                          />
                        </path>
                      </svg>
                      {{ localeString('waiting-connection') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- installWallet -->
            <template v-else-if="state == 'installWallet'">
              <div :class="`${prefixCls}-choose-content-right-content-install`">
                <div
                  :class="`${prefixCls}-choose-content-right-content-install-content`"
                >
                  <div
                    :class="`${prefixCls}-choose-content-right-content-install-content-top`"
                  >
                    <img :src="currentWallet?.icon" height="60" />
                  </div>
                  <div
                    :class="`${prefixCls}-choose-content-right-content-install-content-center`"
                  >
                    <div
                      :class="`${prefixCls}-choose-content-right-content-install-content-center-not-installed`"
                    >
                      {{
                        localeString('not-installed', {
                          name: currentWallet?.name,
                        })
                      }}
                    </div>
                    <div
                      :class="`${prefixCls}-choose-content-right-content-install-content-center-not-installed-desc`"
                    >
                      {{
                        localeString('not-installed-desc', {
                          name: currentWallet?.name,
                        })
                      }}
                    </div>
                    <div
                      :class="`${prefixCls}-choose-content-right-content-btns`"
                    >
                      <a
                        v-if="!!currentWallet?.downloadUrl"
                        :href="currentWallet?.downloadUrl"
                        target="_blank"
                      >
                        <ElButton type="info" :style="{ minWidth: '150px' }">
                          {{ localeString('install') }}
                        </ElButton>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </ElDialog>
    <!-- 切换网络 -->
    <ElDialog
      v-model="switchNetworkDialogVisible"
      :width="360"
      :show-close="false"
      :close-on-click-modal="false"
      :class="`${prefixCls}-switch-network`"
    >
      <template #header="{ close }">
        <ElButton
          type="info"
          text
          bg
          circle
          :style="{ width: '28px', height: '28px' }"
          @click="close"
        >
          <ElIcon :size="20">
            <CloseBold />
          </ElIcon>
        </ElButton>
      </template>
      <div :class="`${prefixCls}-switch-network-content`">
        <div :class="`${prefixCls}-switch-network-content-title`">
          {{ localeString('switch-network') }}
        </div>
        <div :class="`${prefixCls}-switch-network-content-list`">
          <div
            v-for="chain in chains"
            :key="chain.chainId"
            :class="`${prefixCls}-switch-network-content-list-item ${
              chain.chainId == chainId ? 'active' : ''
            }`"
            @click="onChangeNetwork(chain.chainId)"
          >
            <div :class="`${prefixCls}-switch-network-content-list-item-left`">
              <img
                :src="getChainIcon(chain.chainId)"
                height="28"
                :style="{ marginRight: '8px' }"
              />
              <span>{{ chain.name }}</span>
            </div>
            <div :class="`${prefixCls}-switch-network-content-list-item-right`">
              <template v-if="chain.chainId == chainId">
                <div>{{ localeString('connected') }}</div>
                <div class="dot" :style="{ marginLeft: '8px' }" />
              </template>
              <template v-if="chain.chainId == switchToChainId">
                <div :style="{ fontSize: '12px' }">
                  {{ localeString('confirm-in-wallet') }}
                </div>
                <div
                  class="dot"
                  :style="{
                    marginLeft: '8px',
                    backgroundColor: 'var(--el-color-warning)',
                  }"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </ElDialog>
    <!-- 账号信息 -->
    <ElDialog
      v-model="accountInfoDialogVisible"
      :width="360"
      :show-close="false"
      :close-on-click-modal="false"
      :class="`${prefixCls}-account-info`"
    >
      <template #header="{ close }">
        <ElButton
          type="info"
          text
          bg
          circle
          :style="{ width: '28px', height: '28px' }"
          @click="close"
        >
          <ElIcon :size="20">
            <CloseBold />
          </ElIcon>
        </ElButton>
      </template>
      <div :class="`${prefixCls}-account-info-content`">
        <div :class="`${prefixCls}-account-info-content-top`">
          <div :class="`${prefixCls}-account-info-content-top-icon`">
            <img :src="currentWallet?.icon" height="74" />
          </div>
          <div :class="`${prefixCls}-account-info-content-top-info`">
            <div :class="`${prefixCls}-account-info-content-top-info-account`">
              {{ shortAccount }}
            </div>
            <div :class="`${prefixCls}-account-info-content-top-info-balance`">
              {{ balance }}
            </div>
          </div>
        </div>
        <div :class="`${prefixCls}-account-info-content-bottom`">
          <ElButton
            type="info"
            text
            bg
            :style="{ width: '100%', height: '60px' }"
            @click="onCopyAddress()"
          >
            <div
              :class="`${prefixCls}-account-info-content-bottom-btn-content`"
            >
              <div>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 17 16"
                  width="17"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.04236 12.3027H4.18396V13.3008C4.18396 14.8525 5.03845 15.7002 6.59705 15.7002H13.6244C15.183 15.7002 16.0375 14.8525 16.0375 13.3008V6.24609C16.0375 4.69434 15.183 3.84668 13.6244 3.84668H12.4828V2.8418C12.4828 1.29688 11.6283 0.442383 10.0697 0.442383H3.04236C1.48376 0.442383 0.629272 1.29004 0.629272 2.8418V9.90332C0.629272 11.4551 1.48376 12.3027 3.04236 12.3027ZM3.23376 10.5391C2.68689 10.5391 2.39294 10.2656 2.39294 9.68457V3.06055C2.39294 2.47949 2.68689 2.21289 3.23376 2.21289H9.8783C10.4252 2.21289 10.7191 2.47949 10.7191 3.06055V3.84668H6.59705C5.03845 3.84668 4.18396 4.69434 4.18396 6.24609V10.5391H3.23376ZM6.78845 13.9365C6.24158 13.9365 5.94763 13.6699 5.94763 13.0889V6.45801C5.94763 5.87695 6.24158 5.61035 6.78845 5.61035H13.433C13.9799 5.61035 14.2738 5.87695 14.2738 6.45801V13.0889C14.2738 13.6699 13.9799 13.9365 13.433 13.9365H6.78845Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>{{ localeString('copy-address') }}</div>
            </div>
          </ElButton>
          <ElButton
            type="info"
            text
            bg
            :style="{ width: '100%', height: '60px' }"
            @click="onDisconnect"
          >
            <div
              :class="`${prefixCls}-account-info-content-bottom-btn-content`"
            >
              <div>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 18 16"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.67834 15.5908H9.99963C11.5514 15.5908 12.399 14.7432 12.399 13.1777V10.2656H10.6354V12.9863C10.6354 13.5332 10.3688 13.8271 9.78772 13.8271H2.89026C2.3092 13.8271 2.0426 13.5332 2.0426 12.9863V3.15625C2.0426 2.60254 2.3092 2.30859 2.89026 2.30859H9.78772C10.3688 2.30859 10.6354 2.60254 10.6354 3.15625V5.89746H12.399V2.95801C12.399 1.39941 11.5514 0.544922 9.99963 0.544922H2.67834C1.12659 0.544922 0.278931 1.39941 0.278931 2.95801V13.1777C0.278931 14.7432 1.12659 15.5908 2.67834 15.5908ZM7.43616 8.85059H14.0875L15.0924 8.78906L14.566 9.14453L13.6842 9.96484C13.5406 10.1016 13.4586 10.2861 13.4586 10.4844C13.4586 10.8398 13.7321 11.168 14.1217 11.168C14.3199 11.168 14.4635 11.0928 14.6002 10.9561L16.7809 8.68652C16.986 8.48145 17.0543 8.27637 17.0543 8.06445C17.0543 7.85254 16.986 7.64746 16.7809 7.43555L14.6002 5.17285C14.4635 5.03613 14.3199 4.9541 14.1217 4.9541C13.7321 4.9541 13.4586 5.27539 13.4586 5.6377C13.4586 5.83594 13.5406 6.02734 13.6842 6.15723L14.566 6.98438L15.0924 7.33984L14.0875 7.27148H7.43616C7.01917 7.27148 6.65686 7.62012 6.65686 8.06445C6.65686 8.50195 7.01917 8.85059 7.43616 8.85059Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>{{ localeString('disconnect') }}</div>
            </div>
          </ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import { ElButton, ElDialog, ElDivider, ElIcon } from 'element-plus'
import { ArrowDown, CloseBold } from '@element-plus/icons-vue'
import { ethers } from 'ethers'
import { basicProps } from './props'
import { mergeDeep } from './utils/mergeDeep'
import { shortenAddress } from './utils/shortenAddress'
import { replaceTemplateString } from './utils/replaceTemplateString'
import { parseChainId } from './utils/parseChainId'
import defaultLocales from './locales'
import chainETH from './assets/img/eth.svg'
import chainBSC from './assets/img/bsc.svg'
import chainPOLYGON from './assets/img/polygon.svg'
import type IWallet from './interfaces/IWallet'
import './index.scss'

const props = defineProps(basicProps)

const cacheChainIdKey = 'web3-connect-chainId'
const cacheWalletKey = 'web3-connect-wallet'

const chainId = ref<number | undefined>()
const cacheChainId = localStorage.getItem(cacheChainIdKey)
if (cacheChainId) {
  chainId.value = parseChainId(cacheChainId)
}

const account = ref<string | undefined>()

const currentWallet = ref<IWallet | undefined>()

const state = ref<'walletDesc' | 'connecting' | 'installWallet'>('walletDesc')
const { wallets, chains, locales, walletDesc, lang } = toRefs(props)
const prefixCls = 'web3-connect'
const chooseWalletDialogVisible = ref(false)
const switchNetworkDialogVisible = ref(false)
const accountInfoDialogVisible = ref(false)
const isClient = ref(false)
const balance = ref('0 ETH')
const switchToChainId = ref<number | undefined>()

const connected = computed(() => {
  return !!account.value
})

const shortAccount = computed(() => {
  return account.value ? shortenAddress(account.value) : ''
})

const currentChain = computed(() => {
  return getChain(chainId.value)
})

onMounted(async () => {
  isClient.value = true
})

const $locales = mergeDeep(locales.value, defaultLocales)
function localeString(key: string, data: any = {}) {
  const str = replaceTemplateString($locales[lang.value][key], data)
  if (str) {
    return str
  }
  return key
}

function sortWallets() {
  const cacheWallet = localStorage.getItem(cacheWalletKey)
  if (cacheWallet) {
    const cacheWalletIndex = wallets.value.findIndex(
      (item) => item.name === cacheWallet
    )
    wallets.value.unshift(...wallets.value.splice(cacheWalletIndex, 1))
  }
}

function getChain(chainId: number | undefined) {
  return chains.value.find((item) => item.chainId == chainId)
}

function getChainIcon(chainId: number) {
  const chain = getChain(chainId)
  switch (chain?.shortName.toLocaleLowerCase()) {
    case 'bnb':
    case 'bnbt':
      return chainBSC
    case 'matic':
    case 'maticmum':
    case 'zkevm':
    case 'zkevmtest':
      return chainPOLYGON
    default:
      return chainETH
  }
}

async function getBalance() {
  if (currentWallet.value && account.value) {
    try {
      const data = await currentWallet.value.provider?.request({
        method: 'eth_getBalance',
        params: [account.value, 'latest'],
      })
      const chain = getChain(chainId.value)
      const formartEther = ethers.formatEther(data)
      balance.value = `${(+formartEther).toFixed(2)} ${
        chain ? chain.nativeCurrency.symbol : 'ETH'
      }`
    } catch (error) {
      console.error(error)
    }
  }
}

function chainChangedListener(network: number | string) {
  chainId.value = parseChainId(network)
  localStorage.setItem(cacheChainIdKey, `${parseChainId(network)}`)
  getBalance()
}

function accountsChangedListener(accounts: string[]) {
  account.value = accounts[0]
  getBalance()
}

async function onWalletClick(wallet: IWallet) {
  currentWallet.value = wallet
  const valid = await wallet.isValid()
  if (valid) {
    state.value = 'connecting'
    try {
      let desiredChainId = undefined
      if (chains.value && chains.value.length) {
        desiredChainId = chains.value[0].chainId
      }
      await wallet.connectTo(desiredChainId)
      chooseWalletDialogVisible.value = false
      chainId.value = wallet.chainId
      account.value = wallet.account
      localStorage.setItem(cacheChainIdKey, `${wallet.chainId}`)
      localStorage.setItem(cacheWalletKey, `${wallet.name}`)
      getBalance()
      sortWallets()
      wallet.provider?.on('chainChanged', chainChangedListener)
      wallet.provider?.on('accountsChanged', accountsChangedListener)
    } catch (error) {}
  } else {
    state.value = 'installWallet'
  }
}

async function onChangeNetwork(network: number) {
  switchToChainId.value = network
  if (currentWallet.value) {
    try {
      await currentWallet.value.connectTo(network)
      chooseWalletDialogVisible.value = false
      switchToChainId.value = undefined
      chainId.value = currentWallet.value.chainId
      account.value = currentWallet.value.account
      getBalance()
    } catch (error) {}
  }
}

function onCopyAddress() {
  const address: string = account.value || ''
  if (navigator.clipboard) {
    navigator.clipboard.writeText(address)
  } else {
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.style.position = 'fixed'
    textarea.style.clip = 'rect(0 0 0 0)'
    textarea.style.top = '10px'
    textarea.value = address
    textarea.select()
    document.execCommand('copy', true)
    document.body.removeChild(textarea)
  }
}

async function onDisconnect() {
  if (currentWallet.value) {
    await currentWallet.value.disconnect()
    chainId.value = undefined
    account.value = undefined
    currentWallet.value = undefined
    accountInfoDialogVisible.value = false
    state.value = 'walletDesc'
  }
}

defineExpose({
  chainId,
  account,
  wallet: currentWallet,
})
</script>
