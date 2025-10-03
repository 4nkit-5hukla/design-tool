export interface I_Elements {
  id: number;
  name: string;
  thumb_url: string;
  element_url: string;
  type: string;
}

export interface I_API_Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export interface I_Categories {
  category_name: string;
  category_id: number;
  org_id: number;
  has_sub_categories: boolean;
  elements: I_Elements[];
}

export interface I_Elements_Data {
  meta: I_API_Meta;
  data: I_Elements[];
}

export interface I_Categories_Data {
  meta: I_API_Meta;
  data: I_Categories[];
}

export interface I_Category {
  category_id: number;
  org_id: number;
  category_name: string;
  parent_id: number | "null" | null;
  has_sub_categories: boolean;
  elements?: I_Elements_Data;
  categories?: I_Categories_Data;
}

export interface I_Feat_Categories {
  category_name: string;
  category_id: number;
  gird_size: number;
  elements: I_Elements[];
}

export interface I_Feat_Categories_Data {
  payload: I_Feat_Categories[];
}
