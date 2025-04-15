export type TCategoryID = {
  category_id: string;
};

export type TCategoryName = {
  category_name: string;
};

export type TCategoryCreate = TCategoryName & {
  category_image_url: string;
};

export type TCategoryUpdate = TCategoryID & TCategoryImage & TCategoryName;

export type TCategoryImage = {
  category_image_url: string | null;
}

export type TCategoryCreateService = TCategoryName & {
  category_image: File;
};

export type TCategoryUpdateService = TCategoryID & TCategoryCreateService;