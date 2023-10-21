import { _decorator, Component, Button, EditBox, Node } from 'cc';
import 'minigame-api-typings';

const { ccclass, property } = _decorator;

import * as match from "../serverSDK/ccallmatch"
import * as singleton from '../netDriver/netSingleton';

@ccclass('gm')
export class gm extends Component {
    @property(EditBox)
    self1ID:EditBox = null;
    @property(EditBox)
    self1Level:EditBox = null;
    @property(EditBox)
    self2ID:EditBox = null;
    @property(EditBox)
    self2Level:EditBox = null;
    @property(EditBox)
    self3ID:EditBox = null;
    @property(EditBox)
    self3Level:EditBox = null;
    @property(EditBox)
    self4ID:EditBox = null;
    @property(EditBox)
    self4Level:EditBox = null;
    @property(EditBox)
    self5ID:EditBox = null;
    @property(EditBox)
    self5Level:EditBox = null;
    @property(EditBox)
    self6ID:EditBox = null;
    @property(EditBox)
    self6Level:EditBox = null;

    @property(EditBox)
    target1ID:EditBox = null;
    @property(EditBox)
    target1Level:EditBox = null;
    @property(EditBox)
    target2ID:EditBox = null;
    @property(EditBox)
    target2Level:EditBox = null;
    @property(EditBox)
    target3ID:EditBox = null;
    @property(EditBox)
    target3Level:EditBox = null;
    @property(EditBox)
    target4ID:EditBox = null;
    @property(EditBox)
    target4Level:EditBox = null;
    @property(EditBox)
    target5ID:EditBox = null;
    @property(EditBox)
    target5Level:EditBox = null;
    @property(EditBox)
    target6ID:EditBox = null;
    @property(EditBox)
    target6Level:EditBox = null;

    @property(Button)
    btn:Button = null;

    async start() {
        this.btn.node.on(Node.EventType.TOUCH_START, this.gm_set_up, this)
    }

    gm_set_up() {
        let self1 = new match.RoleSetUp();
        self1.RoleID = parseInt(this.self1ID.string);
        self1.Level = parseInt(this.self1Level.string);
        let self2 = new match.RoleSetUp();
        self2.RoleID = parseInt(this.self2ID.string);
        self2.Level = parseInt(this.self2Level.string);
        let self3 = new match.RoleSetUp();
        self3.RoleID = parseInt(this.self3ID.string);
        self3.Level = parseInt(this.self3Level.string);
        let self4 = new match.RoleSetUp();
        self4.RoleID = parseInt(this.self4ID.string);
        self4.Level = parseInt(this.self4Level.string);
        let self5 = new match.RoleSetUp();
        self5.RoleID = parseInt(this.self5ID.string);
        self5.Level = parseInt(this.self5Level.string);
        let self6 = new match.RoleSetUp();
        self6.RoleID = parseInt(this.self6ID.string);
        self6.Level = parseInt(this.self6Level.string);
        let self = [self1, self2, self3, self4, self5, self6];

        let target1 = new match.RoleSetUp();
        target1.RoleID = parseInt(this.target1ID.string);
        target1.Level = parseInt(this.target1Level.string);
        let target2 = new match.RoleSetUp();
        target2.RoleID = parseInt(this.target2ID.string);
        target2.Level = parseInt(this.target2Level.string);
        let target3 = new match.RoleSetUp();
        target3.RoleID = parseInt(this.target3ID.string);
        target3.Level = parseInt(this.target3Level.string);
        let target4 = new match.RoleSetUp();
        target4.RoleID = parseInt(this.target4ID.string);
        target4.Level = parseInt(this.target4Level.string);
        let target5 = new match.RoleSetUp();
        target5.RoleID = parseInt(this.target5ID.string);
        target5.Level = parseInt(this.target5Level.string);
        let target6 = new match.RoleSetUp();
        target6.RoleID = parseInt(this.target6ID.string);
        target6.Level = parseInt(this.target6Level.string);
        let target = [target1, target2, target3, target4, target5, target6];

        singleton.netSingleton.game.set_formationf(self, target);
    }

    update(deltaTime: number) {
    }
}