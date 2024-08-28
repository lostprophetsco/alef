import { PublicProps } from 'vue';

export class ClassComponent<Props, Slots, Emits> {
  $props: Props & PublicProps;
  $slots: Slots;
  $emits: Emits;
}

export type GlobalComponentConstructor<T> = {
  new (): T;
};
