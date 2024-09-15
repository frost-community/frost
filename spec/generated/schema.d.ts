/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/v1/auth/signin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthApi_Signin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/signup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthApi_Signup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/createChatRoom": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ChatRoomApi_CreateChatRoom"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/createLeaf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ChatRoomApi_CreateLeaf"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/deleteChatRoom": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ChatRoomApi_DeleteChatRoom"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/getChatRoom": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ChatRoomApi_GetChatRoom"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/getTimeline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ChatRoomApi_GetTimeline"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/chatRoom/searchChatRooms": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ChatRoomApi_SearchChatRooms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/echo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["RootApi_GetEcho"];
        put?: never;
        post: operations["RootApi_PostEcho"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/leaf/createLeaf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["LeafApi_CreateLeaf"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/leaf/deleteLeaf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["LeafApi_DeleteLeaf"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/leaf/getLeaf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LeafApi_GetLeaf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/leaf/searchLeafs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["LeafApi_SearchLeafs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/deleteUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UserApi_DeleteUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/followUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UserApi_FollowUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/getFollowings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UserApi_GetFollowings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/getHomeTimeline": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UserApi_GetHomeTimeline"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/getUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UserApi_GetUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/searchUsers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["UserApi_SearchUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/unfollowUser": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["UserApi_UnfollowUser"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        "Api.v1.AuthInfo": {
            accessToken: components["schemas"]["Api.v1.Token"];
            refreshToken: components["schemas"]["Api.v1.Token"];
            user: components["schemas"]["Api.v1.User"];
        };
        "Api.v1.ChatRoom": {
            chatRoomId: string;
            title: string;
            description: string;
        };
        "Api.v1.CreateChatRoomBody": {
            title: string;
            description: string;
        };
        "Api.v1.CreateChatRoomLeafBody": {
            chatRoomId: string;
            content: string;
        };
        "Api.v1.CreateLeafBody": {
            content: string;
        };
        "Api.v1.DeleteChatRoomBody": {
            chatRoomId: string;
        };
        "Api.v1.DeleteLeafBody": {
            leafId: string;
        };
        "Api.v1.DeleteUserBody": {
            userId: string;
        };
        "Api.v1.FollowUserBody": {
            userId: string;
        };
        "Api.v1.GetChatRoomTimelineQueryString": {
            nextCursor?: string;
            prevCursor?: string;
            limit?: string;
        };
        "Api.v1.GetHomeTimelineQueryString": {
            nextCursor?: string;
            prevCursor?: string;
            limit?: string;
        };
        "Api.v1.Leaf": {
            leafId: string;
            chatRoomId?: string;
            userId: string;
            content: string;
        };
        "Api.v1.SearchChatRoomsQueryString": {
            offset?: string;
            limit?: string;
        };
        "Api.v1.SearchLeafsQueryString": {
            offset?: string;
            limit?: string;
        };
        "Api.v1.SearchUsersQueryString": {
            offset?: string;
            limit?: string;
        };
        "Api.v1.SigninBody": {
            name: string;
            password?: string;
        };
        "Api.v1.SignupBody": {
            name: string;
            password?: string;
            displayName: string;
        };
        "Api.v1.Token": {
            token: string;
            scopes: string[];
        };
        "Api.v1.UnfollowUserBody": {
            userId: string;
        };
        "Api.v1.User": {
            userId: string;
            name: string;
            displayName: string;
            passwordAuthEnabled: boolean;
        };
    };
    responses: never;
    parameters: {
        "Api.v1.CursorControl.limit": string;
        "Api.v1.CursorControl.nextCursor": string;
        "Api.v1.CursorControl.prevCursor": string;
        "Api.v1.GetChatRoomQueryString": string;
        "Api.v1.GetFollowingsQueryString.userId": string;
        "Api.v1.GetLeafQueryString": string;
        "Api.v1.GetUserQueryString.userId": string;
        "Api.v1.GetUserQueryString.username": string;
        "Api.v1.OffsetControl.limit": string;
        "Api.v1.OffsetControl.offset": string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AuthApi_Signin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.SigninBody"];
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.AuthInfo"];
                };
            };
        };
    };
    AuthApi_Signup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.SignupBody"];
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.AuthInfo"];
                };
            };
        };
    };
    ChatRoomApi_CreateChatRoom: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.CreateChatRoomBody"];
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.ChatRoom"];
                };
            };
        };
    };
    ChatRoomApi_CreateLeaf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.CreateChatRoomLeafBody"];
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"];
                };
            };
        };
    };
    ChatRoomApi_DeleteChatRoom: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.DeleteChatRoomBody"];
            };
        };
        responses: {
            /** @description There is no content to send for this request, but the headers may be useful.  */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ChatRoomApi_GetChatRoom: {
        parameters: {
            query: {
                chatRoomId: components["parameters"]["Api.v1.GetChatRoomQueryString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.ChatRoom"];
                };
            };
        };
    };
    ChatRoomApi_GetTimeline: {
        parameters: {
            query?: {
                nextCursor?: components["parameters"]["Api.v1.CursorControl.nextCursor"];
                prevCursor?: components["parameters"]["Api.v1.CursorControl.prevCursor"];
                limit?: components["parameters"]["Api.v1.CursorControl.limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"][];
                };
            };
        };
    };
    ChatRoomApi_SearchChatRooms: {
        parameters: {
            query?: {
                offset?: components["parameters"]["Api.v1.OffsetControl.offset"];
                limit?: components["parameters"]["Api.v1.OffsetControl.limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.ChatRoom"][];
                };
            };
        };
    };
    RootApi_GetEcho: {
        parameters: {
            query: {
                message: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
        };
    };
    RootApi_PostEcho: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    message: string;
                };
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
        };
    };
    LeafApi_CreateLeaf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.CreateLeafBody"];
            };
        };
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"];
                };
            };
        };
    };
    LeafApi_DeleteLeaf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.DeleteLeafBody"];
            };
        };
        responses: {
            /** @description There is no content to send for this request, but the headers may be useful.  */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    LeafApi_GetLeaf: {
        parameters: {
            query: {
                leafId: components["parameters"]["Api.v1.GetLeafQueryString"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"];
                };
            };
        };
    };
    LeafApi_SearchLeafs: {
        parameters: {
            query?: {
                offset?: components["parameters"]["Api.v1.OffsetControl.offset"];
                limit?: components["parameters"]["Api.v1.OffsetControl.limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"][];
                };
            };
        };
    };
    UserApi_DeleteUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.DeleteUserBody"];
            };
        };
        responses: {
            /** @description There is no content to send for this request, but the headers may be useful.  */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserApi_FollowUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.FollowUserBody"];
            };
        };
        responses: {
            /** @description There is no content to send for this request, but the headers may be useful.  */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserApi_GetFollowings: {
        parameters: {
            query: {
                offset?: components["parameters"]["Api.v1.OffsetControl.offset"];
                limit?: components["parameters"]["Api.v1.OffsetControl.limit"];
                userId: components["parameters"]["Api.v1.GetFollowingsQueryString.userId"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.User"][];
                };
            };
        };
    };
    UserApi_GetHomeTimeline: {
        parameters: {
            query?: {
                nextCursor?: components["parameters"]["Api.v1.CursorControl.nextCursor"];
                prevCursor?: components["parameters"]["Api.v1.CursorControl.prevCursor"];
                limit?: components["parameters"]["Api.v1.CursorControl.limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.Leaf"][];
                };
            };
        };
    };
    UserApi_GetUser: {
        parameters: {
            query?: {
                userId?: components["parameters"]["Api.v1.GetUserQueryString.userId"];
                username?: components["parameters"]["Api.v1.GetUserQueryString.username"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.User"];
                };
            };
        };
    };
    UserApi_SearchUsers: {
        parameters: {
            query?: {
                offset?: components["parameters"]["Api.v1.OffsetControl.offset"];
                limit?: components["parameters"]["Api.v1.OffsetControl.limit"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The request has succeeded. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Api.v1.User"][];
                };
            };
        };
    };
    UserApi_UnfollowUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["Api.v1.UnfollowUserBody"];
            };
        };
        responses: {
            /** @description There is no content to send for this request, but the headers may be useful.  */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
