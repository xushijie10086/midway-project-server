/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-25 10:12:55
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-25 10:16:14
 * @FilePath: \midway-project-server\src\typeorm-event-subscriber.ts
 * @Description: 描述一下
 * 
 */
import { EntitySubscriberInterface, InsertEvent } from "typeorm";
import { snowFlake } from "./utils/snow.flake";
import { EventSubscriberModel } from "@midwayjs/typeorm";

@EventSubscriberModel()
export class EverythineSubscriber implements EntitySubscriberInterface {

    beforeInsert(event: InsertEvent<any>): void | Promise<any> {
        if (!event.entity.id) {
            event.entity.id = snowFlake.nextId()
        }
    }
}