/*
 * 新建 AudioManager.ts
 * author: Hotaru
 * 2024/04/06
 */
import { _decorator, AudioClip, AudioSource, Component, director, Node } from 'cc';
import { loadAssets } from '../bundle/LoadAsset';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager
{
    private static _instance:AudioManager=null;
    //音频组件
    private _audioSource: AudioSource;

    constructor()
    {
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';
        // 添加节点到场景
        director.getScene().addChild(audioMgr);
        //标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);
        //添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);
    }

    public static get Instance()
    {
        if(null == this._instance)
        {
            this._instance=new AudioManager();
        }
        return this._instance;
    }

    public get AudioSource()
    {
        return this._audioSource;
    }

    //播放长音频（BGM等）
    public async PlaySound(sound: AudioClip | string, volume: number = 1.0)
    {
        try
        {
            if (sound instanceof AudioClip) 
            {
    
                this._audioSource.stop();
                this._audioSource.clip = sound;
                this._audioSource.play();
                this.AudioSource.volume = volume;
    
            }
            else 
            {
                let clip = await loadAssets.LoadAudio(sound);
    
                this._audioSource.stop();
                this._audioSource.clip = clip;
                this._audioSource.play();
                this.AudioSource.volume = volume;
            }
        }
       catch(error)
       {
            console.error('AudioManager 下 PlaySound 错误 err: ',error);
       }
    }

    //播放断音频（按钮音等）
    public async PlayerOnShot(sound: AudioClip | string, volume: number = 1.0)
    {
        try
        {
            if (sound instanceof AudioClip) 
            {
                this._audioSource.playOneShot(sound, volume);
            }
            else 
            {
                let clip = await loadAssets.LoadAudio(sound);
                
                this._audioSource.playOneShot(clip,volume);
            }
                
        }
        catch(error)
        {
            console.error('AudioManager 下 PlayerOnShot 错误 err: ',error);
        }
    }

    //暂停
    public Stop()
    {
        this._audioSource.stop();
    }

    //播放
    public Pause() 
    {
        this._audioSource.pause();
    }

    //恢复
    public Resume()
    {
        this._audioSource.play();
    }

}


