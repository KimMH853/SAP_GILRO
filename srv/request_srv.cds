using demo.request from '../db/request';

service RequestService {
    entity Request       as projection on request.Request;
    entity Request_State as projection on request.Request_State;
    entity Product       as projection on request.Product;

    view Request_product_list as select from request.Request_product_list;
}
