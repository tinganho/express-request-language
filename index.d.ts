
import * as e from 'express';

declare namespace ExpressRequestLanguage {
    interface Cookie {

        /**
         * Cookie name.
         */
        name: string;

        /**
         * Cookie option passed in `res.cookie(name, value, [options])`.
         */
        options?: e.CookieOptions;

        /**
         * URL to change preferred language.
         */
        url?: string;
    }

    interface Options {

        /**
         * Define your supported languages.
         */
        languages: string[];

        /**
         * Query name used for changing language.
         */
        queryName?: string;

        /**
         * Cookie options.
         */
        cookie?: Cookie;

        /**
         * A localization import function. One of the supported languages will be passed as argument.
         * And the result will be set to `req.localization`. Very handy to be used with L10ns https://l10ns.org.
         */
        localizations?: (lang: string) => any;
    }

}

declare function requestLanguage(options: ExpressRequestLanguage.Options): any;
declare namespace requestLanguage { }
export = requestLanguage;

declare global {
    namespace Express {
        export interface Request {
            language: string;
            localizations?: any;
        }
    }
}
