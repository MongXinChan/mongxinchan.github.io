---
title: Vue 3.0 快速上手教程
published: 2025-03-26
updated: 2025-04-07
description: 'Welcome to my Vue notes!'
image: ''
tags: [ComputerScience,Fronted,Vue ]
category: 'ComputerScience''中文'
draft: false 
---

Vue 3 是 Vue.js 的最新版本，它带来了性能提升、更好的 TypeScript 支持以及新的 Composition API 等特性。以下是基于 Vue 3 的快速上手教程，帮助你快速掌握其核心语法和功能。

> [!NOTE]
> 本教程假设你已经具备基本的 JavaScript 和 HTML 知识。
>
> 你可以通过 [Vue.js 官方文档](https://v3.vuejs.org/guide/introduction.html)了解更多关于 Vue 3 的详细信息。
>
>本笔记基于课程[半小时入门Vue3.0核心语法](https://www.bilibili.com/video/BV1Pg4y1A7pn)

# 1. 环境准备

在开始之前，确保你的开发环境已经安装了 Node.js 和 npm。你可以通过以下命令安装 Vue CLI：

```bash
npm install -g @vue/cli
```

安装完成后，可以通过以下命令创建一个新的 Vue 3 项目：

```bash
vue create my-vue3-project
```

在创建过程中，确保选择 Vue 3 作为项目版本。

# 2. Vue 3 基础语法

##  2.1 `<script setup>`

Vue 3 引入了 `<script setup>` 语法，它是一种更简洁的组件编写方式，适用于组合式 API。以下是一个简单的示例：

```vue
<!-- App.vue -->
<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div class="wrapper">
      <HelloWorld />
    </div>
  </header>
  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  .logo {
    margin: 0 2rem 0 0;
  }
  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
```

##  2.2 响应式数据

Vue 3 使用 `ref` 和 `reactive` 来定义响应式数据。`ref` 用于定义单个值的响应式数据，而 `reactive` 用于定义对象的响应式数据。

```vue
<!-- Example.vue -->
<script setup>
import { ref, reactive } from 'vue'

const count = ref(0) // 单个值的响应式数据
const state = reactive({
  name: 'Vue',
  version: 3
}) // 对象的响应式数据
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="count++">Increment</button>
    <p>{{ state.name }} {{ state.version }}</p>
  </div>
</template>
```

##  2.3 生命周期钩子

Vue 3 的生命周期钩子与 Vue 2 类似，但使用方式有所不同。在 `<script setup>` 中，生命周期钩子需要通过 `onMounted`、`onUpdated` 等函数来定义。

```vue
<script setup>
import { onMounted, onUpdated } from 'vue'

onMounted(() => {
  console.log('Component is mounted')
})

onUpdated(() => {
  console.log('Component is updated')
})
</script>
```

##  2.4 计算属性和侦听器

计算属性和侦听器在 Vue 3 中的使用方式与 Vue 2 类似，但需要通过 `computed` 和 `watch` 函数来定义。

```vue
<script setup>
import { ref, computed, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

watch(firstName, (newVal, oldVal) => {
  console.log(`First name changed from ${oldVal} to ${newVal}`)
})
</script>

<template>
  <div>
    <p>{{ fullName }}</p>
  </div>
</template>
```

# 3. 组合式 API

组合式 API 是 Vue 3 的核心特性之一，它允许你将逻辑相关的代码组织在一起，提高代码的可维护性和可重用性。

##  3.1 使用 `setup` 函数

在 Vue 3 中，`setup` 函数是组合式 API 的入口点。你可以在 `setup` 函数中定义响应式数据、生命周期钩子、计算属性等。

```vue
<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    return {
      count,
      doubleCount
    }
  }
}
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

##  3.2 自定义组合函数

自定义组合函数是一种将逻辑相关的代码封装在一起的方式，可以提高代码的可重用性。

```vue
<script setup>
import { ref, computed } from 'vue'

function useCounter() {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  const increment = () => count.value++

  return { count, doubleCount, increment }
}

const { count, doubleCount, increment } = useCounter()
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

# 4. TypeScript 支持

Vue 3 提供了更好的 TypeScript 支持，你可以通过定义类型来提高代码的可维护性和可读性。

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```

# 5. 示例代码

以下是完整的示例代码，展示了上述功能的综合应用。

```vue
<!-- App.vue -->
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

onMounted(() => {
  console.log('Component is mounted')
})
</script>

<template>
  <div>
    <h1>Vue 3 Example</h1>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>

<style scoped>
div {
  text-align: center;
  margin-top: 50px;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
```

# 6. 总结

通过以上内容，你已经掌握了 Vue 3 的基本语法和功能，包括 `<script setup>`、响应式数据、生命周期钩子、组合式 API 和 TypeScript 支持。这些功能将帮助你快速构建动态的用户界面。接下来，你可以通过阅读官方文档和实践更多项目，进一步提升你的 Vue.js 技能。