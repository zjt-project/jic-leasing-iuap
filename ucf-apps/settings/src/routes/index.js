/**
 * 前端路由说明：
 * 基于浏览器 History 的前端 Hash 路由
 */

import React from "react";
import { Route } from "mirrorx";
import { FunctionRegister } from "./function-register/container";
import {Role} from "./role/container";

export default () => (

    <div className="route-content">
        <Route exact path="/function-register" component={FunctionRegister} />
        <Route exact path="/role" component={Role} />
    </div>

);
