export type TVariantID = {
  variant_id: string;
};

export type TVariant = TVariantID & {
  variant_name: string;
}
export type TVariants = TVariantID & {
  variant: TVariant[];
}