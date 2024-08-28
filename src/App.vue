<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <a href="" class="header__logo-link">
          <img
            class="header__logo-img"
            src="@/assets/img/logo.svg"
            alt="logo"
            width="93"
            height="29"
          />
        </a>
      </div>

      <div class="header__menu">
        <ul class="header__menu-list">
          <li class="header__menu-item">
            <component
              :is="visibleSection === 'form' ? 'span' : 'a'"
              @click="visibleSection = 'form'"
              :class="`header__menu-link ${visibleSection === 'form' ? 'header__menu-link--active' : ''}`"
              href="#"
            >
              Форма
            </component>
          </li>

          <li class="header__menu-item" v-if="isLocalData">
            <component
              :is="visibleSection === 'preview' ? 'span' : 'a'"
              @click="visibleSection = 'preview'"
              :class="`header__menu-link ${visibleSection === 'preview' ? 'header__menu-link--active' : ''}`"
              href="#"
            >
              Превью
            </component>
          </li>
        </ul>
      </div>
    </div>
  </header>

  <main class="main">
    <div class="main__container">
      <form v-show="visibleSection === 'form'" class="main__form form">
        <div class="form__title">Персональные данные</div>

        <InputText v-model="formData.name" css-class="input-group">
          <template #placeholder>Имя</template>
        </InputText>

        <InputText v-model="formData.age" css-class="input-group">
          <template #placeholder>Возраст</template>
        </InputText>

        <div class="form__heading-children">
          <div class="form__title">Дети (макс. 5)</div>

          <button
            type="button"
            v-if="childrenRowCount < 5"
            class="children-form__add"
            @click="childrenRowHandler()"
          >
            <img src="@/assets/img/plus.svg" alt="Add" class="children-form__add-img" />
            Добавить ребенка
          </button>
        </div>

        <div class="form__children children">
          <div v-for="i in childrenRowCount" :key="i - 1" class="children__item">
            <InputText v-model="formData.children[i - 1].name" css-class="input-group">
              <template #placeholder>Имя</template>
            </InputText>

            <InputText v-model="formData.children[i - 1].age" css-class="input-group">
              <template #placeholder>Возраст</template>
            </InputText>

            <button
              class="children__remove"
              type="button"
              :disabled="childrenRowCount <= 1"
              @click="childrenRemoveHandler(i - 1)"
            >
              Удалить
            </button>
          </div>

          <button
            class="children__save"
            type="button"
            @click="childrenSaveHandler()"
            :disabled="
              !formData.age ||
              !formData.name ||
              !formData.children[0].age ||
              !formData.children[0].name
            "
          >
            {{ childrenSave }}
          </button>
        </div>
      </form>

      <div v-show="visibleSection === 'preview'" class="main-preview preview">
        <div class="form">
          <div class="form__title">Персональные данные</div>
          <div class="preview__name">
            {{ formData.name }}
            <template v-if="formData.age">, </template>
            {{ formData.age }}
          </div>

          <div class="preview__children">
            <div class="form__title">Дети</div>

            <div class="preview__children-items">
              <div v-for="(child, i) in formData.children" :key="i" class="preview__child">
                {{ child.name }}
                <template v-if="child.age">, </template>
                {{ child.age }} лет
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer__container">all rights reserved</div>
  </footer>
</template>

<script setup lang="ts">
// Vue
import { onMounted, reactive, ref } from 'vue';

// Components
import InputText from './components/InputText.vue';

const visibleSection = ref('form');
const childrenRowCount = ref(1);
const childrenSave = ref('Сохранить');
const isLocalData = ref(!!localStorage.getItem('formData'));

/**
 * @description Add new child
 */
const childrenRowHandler = () => {
  if (childrenRowCount.value === 5) return;

  childrenRowCount.value += 1;
  childrenSave.value = 'Сохранить';
  formData.children.push({ name: '', age: undefined });
};

/**
 * @description Remove child
 * @param index
 */
const childrenRemoveHandler = (index: number) => {
  if (childrenRowCount.value <= 1) return;

  childrenRowCount.value -= 1;
  formData.children.splice(index, 1);

  childrenSaveHandler();
};

/**
 * @description Form data interface
 */
interface IFormData {
  name: string | undefined;
  age: number | undefined;
  children: {
    name: string | undefined;
    age: number | undefined;
  }[];
}

/**
 * @description Form data
 * @type {IFormData}
 */
const formData = reactive<IFormData>({
  name: undefined,
  age: undefined,
  children: [
    {
      name: undefined,
      age: undefined,
    },
  ],
});

/**
 * @description Save children
 */
const childrenSaveHandler = () => {
  for (let i = 0; i < formData.children.length; i++) {
    if (!formData.children[i].age && !formData.children[i].name) {
      formData.children.splice(i, 1);
      childrenRowCount.value = formData.children.length;
    }
  }

  if (formData.age && formData.name) {
    localStorage.setItem('formData', JSON.stringify(formData));
    childrenSave.value = 'Сохранено';
  }
};

/**
 * @description Get data from localStorage
 */
onMounted(() => {
  if (!!localStorage.getItem('formData')) {
    isLocalData.value = true;

    childrenRowCount.value = JSON.parse(localStorage.getItem('formData') as string).children.length;

    formData.name = JSON.parse(localStorage.getItem('formData') as string).name;
    formData.age = JSON.parse(localStorage.getItem('formData') as string).age;

    for (let i = 0; i < childrenRowCount.value; i++) {
      formData.children[i] = JSON.parse(localStorage.getItem('formData') as string).children[i];
    }
  }

  if (childrenRowCount.value === 0) {
    childrenRowCount.value = 1;
  }
});
</script>

<style lang="scss">
.header {
  position: relative;
  padding: 22px 0;
  border-bottom: 1px solid #1111111a;

  // .header__container
  &__container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 1200px;
    padding: 0 15px;
    margin: 0 auto;
  }

  // .header__logo
  &__logo {
    position: absolute;
    top: 50%;
    left: 15px;
    margin-right: auto;
    transform: translateY(-50%);
  }

  // .header__logo-link
  &__logo-link {
    display: block;
    text-decoration: none;
  }

  // .header__logo-img
  &__logo-img {
    display: block;
  }

  // .header__menu
  &__menu {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  // .header__menu-list
  &__menu-list {
    display: flex;
    gap: 24px;
    align-items: center;
    justify-content: center;
  }

  // .header__menu-link
  &__menu-link {
    font-size: 14px;
    color: var(--color-gray-transparent);
    text-decoration: none;

    // .header__menu-link--active
    &--active {
      color: var(--color-black);
    }
  }
}

.main {
  flex: 1 0 auto;
  margin: 30px 0;

  // .main__container
  &__container {
    max-width: 646px;
    padding: 0 15px;
    margin: 0 auto;
  }
}

// .input-group
.input-group {
  $this: &;

  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 56px;
  padding: 0 15px;
  margin-top: 10px;
  border: 1px solid var(--color-gray);
  border-radius: 4px;

  // .input-group--focused, .input-group--filled
  &--focused,
  &--filled {
    // .input-group--focused .input-group__placeholder,
    // .input-group--filled .input-group__placeholder
    #{$this}__placeholder {
      transform: translateY(-20px);
    }

    // .input-group--focused .input-group__input,
    // .input-group--filled .input-group__input
    #{$this}__input {
      visibility: visible;
      opacity: 1;
    }
  }

  // .input-group__placeholder
  &__placeholder {
    position: absolute;
    top: 50%;
    left: 15px;
    z-index: -1;
    display: block;
    font-size: 13px;
    color: var(--color-gray-transparent);
    background-color: var(--bg-color-white);
    transition: 0.3s ease-in-out;
    transform: translateY(-50%);
  }

  // .input-group__label
  &__label {
    position: relative;
    z-index: 10;
    width: 100%;
  }

  // .input-group__input
  &__input {
    position: relative;
    top: 24px;
    z-index: 0;
    font-size: 14px;
    color: var(--color-black111);
    background: transparent;
    border: none;
    outline: none;
    opacity: 0;
    transition: 0.3s ease-in-out;
  }
}

.form {
  // .form__title
  &__title {
    font-size: 16px;
    font-weight: var(--font-weight-500);
    line-height: 24px;
    color: var(--color-black111);
  }

  // .form__heading-children
  &__heading-children {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 33px 0 0;
  }
}

.children-form {
  // .children-form__add
  &__add {
    display: inline-flex;
    gap: 4px;
    align-items: center;
    padding: 10px 20px;
    font-size: 14px;
    color: var(--color-blue);
    cursor: pointer;
    background: none;
    border: 2px solid var(--color-blue);
    border-radius: 100px;
  }

  // .children-form__add-img
  &__add-img {
    display: block;
    width: 24px;
    height: 24px;
  }
}

// .children
.children {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
  margin-top: 11px;

  // .children .input-group
  .input-group {
    margin-top: 0;
  }

  // .children__item
  &__item {
    display: flex;
    flex-flow: row nowrap;
    gap: 18px;
    align-items: center;
    width: 100%;
  }

  // .children__remove
  &__remove {
    font-size: 14px;
    color: var(--color-blue);
    background: none;
    border: none;
  }

  // .children__save
  &__save {
    display: inline-block;
    width: max-content;
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 14px;
    line-height: 24px;
    color: var(--color-white);
    background: var(--color-blue);
    border: none;
    border-radius: 100px;
  }
}

.preview {
  // .preview__name
  &__name {
    margin-top: 20px;
    font-size: 16px;
    font-weight: var(--font-weight-700);
    line-height: 24px;
  }

  // .preview__children
  &__children {
    margin-top: 60px;

    // .preview__children-items
    &-items {
      display: inline-flex;
      flex-flow: column;
      gap: 20px;
      margin-top: 20px;
    }
  }

  // .preview__child
  &__child {
    display: inline-flex;
    width: max-content;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: var(--font-weight-700);
    line-height: 24px;
    color: var(--color-black);
    background-color: var(--color-gray);
    border-radius: 5px;
  }
}

.footer {
  flex: 0 0 auto;
  padding: 30px 0;
  background-color: #fafafa;

  // .footer__container
  &__container {
    max-width: 1200px;
    padding: 0 15px;
    margin: 0 auto;
    font-size: 13px;
    color: var(--color-black);
    text-align: center;
  }
}
</style>
