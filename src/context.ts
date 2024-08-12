import { ArtaxContext } from '@hive-o/artax-common';

export interface XssContext extends ArtaxContext {
  payloads: string[];
}
