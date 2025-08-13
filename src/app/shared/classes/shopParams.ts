export class ShopParams {
    brandId = 0;
    typeId = 0;
    sort = 'brand,type';
    pageNumber = 1;
    pageSize = 6;
    search?: string;
    tags?: string = '';
    collections?: string = '';
}