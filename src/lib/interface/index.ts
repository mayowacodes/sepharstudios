export interface iMeta {
  title: string;
  keywords: string[];
  description: string;
  ogimage: string;
  link: string;
}

export interface iFetchMeta {
  meta: { cursor: string; more: boolean; size: number; };
  data: any[];
  total: number;
  lastIndex?: number;
}
