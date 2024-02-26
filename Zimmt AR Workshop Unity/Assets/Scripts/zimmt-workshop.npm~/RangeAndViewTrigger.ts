import { Behaviour, GameObject, serializable, Context, ICamera, AudioSource, EventList, Text, Camera, XRFlag, XRState, XRStateFlag, UsdzBehaviour, BehaviorModel } from "@needle-tools/engine";
import { ActionBuilder, AuralMode, PlayAction, TriggerBuilder } from "@needle-tools/engine/lib/engine-components/export/usdz/extensions/behavior/BehavioursBuilder";
import { Object3D, Vector3 } from "three";

// Documentation → https://docs.needle.tools/scripting

export class RangeAndViewTrigger extends Behaviour implements UsdzBehaviour {

    static get cameraTransform(): Camera{
        if (!RangeAndViewTrigger._cameraTransform || !RangeAndViewTrigger._cameraTransform.gameObject) RangeAndViewTrigger._cameraTransform = GameObject.findObjectOfType(Camera);
        return RangeAndViewTrigger._cameraTransform!;
    }
    private static _cameraTransform: Camera | null;

    @serializable(EventList)
    onEnter: EventList;
    @serializable(EventList)
    onExit: EventList;
    
    triggerRange: number = 5;
    triggerDot: number = 0.5;
    arOnly: boolean = true;

    @serializable(AudioSource)
    audioSource: AudioSource | null;

    log: boolean = false;

    private operatingVector = new Vector3();
    private operatingVector2 = new Vector3();
    private inside: boolean = false;

    // private txt: Text | null = null;

    

    onBeforeRender(): void {
        // if (!this.txt) this.txt = this.gameObject.getComponentInChildren(Text);
        if (this.arOnly && !XRState.Global.Has(XRStateFlag.AR)) {
            if (this.inside) {
                this.onExit.invoke();
                this.inside = false;
            }
            return;
        }

        this.operatingVector.copy(RangeAndViewTrigger.cameraTransform.worldPosition);
        this.operatingVector.y = 0;
        this.operatingVector2.copy(this.worldPosition);
        this.operatingVector2.y = 0;
        const dist = this.operatingVector.distanceTo(this.operatingVector2);
        let shouldBeInside = dist < this.triggerRange;

        this.operatingVector.copy(this.worldPosition);
        this.operatingVector.sub(RangeAndViewTrigger.cameraTransform.worldPosition);
        this.operatingVector.y = 0;
        this.operatingVector.normalize();
        this.operatingVector2.copy(RangeAndViewTrigger.cameraTransform.forward);
        let dot = this.operatingVector.dot(this.operatingVector2);

        if (!this.inside && dot < this.triggerDot) shouldBeInside = false; 
        // if (this.txt && this.context.time.frameCount % 5 === 0) this.txt.text = dot.toString();
        if (this.log) console.log(dist, dot);

        if (!this.inside && shouldBeInside) {
            if (this.audioSource && !this.audioSource.isPlaying) this.audioSource.play();
            this.onEnter.invoke();
        } else if (this.inside && !shouldBeInside) {
            if (this.audioSource && this.audioSource.isPlaying) this.audioSource.stop();
            this.onExit.invoke();
        }
        this.inside = shouldBeInside;
    }

    //USDZ Export
    //Missing: stopping audio on exit
    //Missing: only trigger when in view
    createBehaviours(ext, model, _context) {
        if (!this.audioSource) return;
        if (model.uuid === this.gameObject.uuid) {
            const clipUrl = this.audioSource.clip;
            if (!clipUrl) return;
            const playbackTarget = this.audioSource.gameObject;
            const clipName = clipUrl.split('/').pop();
            const volume = this.audioSource.volume;
            const auralMode = this.audioSource.spatialBlend === 0 ? AuralMode.NonSpatial : AuralMode.Spatial;
            const playClip = new BehaviorModel("playAudioOnProximity" + this.name,
                TriggerBuilder.proximityToCameraTrigger(this.gameObject, this.triggerRange),
                ActionBuilder.playAudioAction(playbackTarget, "audio/" + clipName, PlayAction.Play, volume, auralMode),
            );
            ext.addBehavior(playClip);
        }
    }

    async afterSerialize(_ext, context) {
        if (!this.audioSource) return;
        const clipUrl = this.audioSource.clip;
        if (!clipUrl) return;
        const clipName = clipUrl.split('/').pop();

        const audio = await fetch(this.audioSource.clip);
        const audioBlob = await audio.blob();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioData: Uint8Array = new Uint8Array(arrayBuffer)

        context.files["audio/" + clipName] = audioData;
    }
}