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
    private audioSource: AudioSource;
    //音频寄存器 
    private static audioClips:AudioClip[]=[];

    constructor()
    {
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';
        // 添加节点到场景
        director.getScene().addChild(audioMgr);
        //标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);
        //添加 AudioSource 组件，用于播放音频。
        this.audioSource = audioMgr.addComponent(AudioSource);
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
        return this.audioSource;
    }

    public Init()
    {
        
    }

    //播放长音频（BGM等）
    public async PlaySound(sound: AudioClip | string, volume: number = 1.0)
    {
        try
        {
            if (sound instanceof AudioClip) 
            {
                this.audioSource.stop();
                this.audioSource.clip = sound;
                this.audioSource.play();
                this.AudioSource.volume = volume;
    
            }
            else 
            {
                let clip = this.FoundClips(sound);
                if(null == clip)
                {
                    clip = await loadAssets.LoadAudio(sound) as AudioClip;
                    AudioManager.audioClips.push(clip);
                }
                
                this.audioSource.stop();
                this.audioSource.clip = clip;
                this.audioSource.play();
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
                this.audioSource.playOneShot(sound, volume);
            }
            else 
            {
                let clip = this.FoundClips(sound);
                if(null == clip)
                {
                    clip = await loadAssets.LoadAudio(sound) as AudioClip;
                    AudioManager.audioClips.push(clip);
                }
            
                this.audioSource.playOneShot(clip,volume);
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
        this.audioSource.stop();
    }

    //播放
    public Pause() 
    {
        this.audioSource.pause();
    }

    //恢复
    public Resume()
    {
        this.audioSource.play();
    }

    private FoundClips(_name:string) : AudioClip
    {
        let ads=_name.split('/');
        for(let i=0 ; i<AudioManager.audioClips.length ; i++)
        {
            if(AudioManager.audioClips[i].name == ads[1])
            {
                return AudioManager.audioClips[i];
            }
        }
        return null;
    }
}


