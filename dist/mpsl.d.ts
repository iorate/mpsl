export declare type ParseResult = {
    tld: string;
    sld: string;
    domain: string;
    subdomain: string | null;
};
export declare function parse(domain: string): ParseResult | null;
export declare function get(domain: string): string | null;
export declare function isValid(domain: string): boolean;
