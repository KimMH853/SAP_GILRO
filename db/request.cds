namespace demo.request;

using {
    cuid,
    managed,
    Currency,
    Country
} from '@sap/cds/common';

entity Request {
    key request_number        : Integer @title: '요청번호';
        product_number        : Integer @title: '요청물품번호';
        request_quantity      : Integer @title: '요청수량';
        requestor             : String  @title: '요청자';
        request_date          : String  @title: '요청날짜';
        request_state         : String  @title: '요청상태';
        request_reason        : String  @title: '요청사유';
        request_reject_reason : String  @title: '요청거절사유';
};

entity Request_State {
    key request_state_key : String @title: '요청상태 키워드';
        request_state_kor : String @title: '요청상태 한국어';
};

entity Product {
    key product_number   : Integer @title: '물품번호';
        product_name     : String  @title: '물품이름';
        product_quantity : Integer @title: '재고';
        product_date     : String  @title: '등록날짜';
        product_category : String  @title: '물품카테고리';
        product_price    : Integer @title: '가격';
};

@cds.persistence.exists
entity Request_product_list {
    key request_number        : Integer;
        product_number        : Integer;
        request_quantity      : Integer;
        requestor             : String;
        request_date          : String;
        request_state         : String;
        request_reason        : String;
        request_reject_reason : String;
        product_name          : String;
        product_price         : Integer;
};
