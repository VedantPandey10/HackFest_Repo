/**
 * Advanced Audio Proctoring Utility
 * Generates strike-intensified buzzer sounds using the Web Audio API.
 * No external audio files required.
 */

class AudioProctor {
    private static context: AudioContext | null = null;

    private static getContext(): AudioContext {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.context;
    }

    /**
     * Plays an urgent buzzer sound that increases in intensity with strikes.
     * @param strikeCount The current number of strikes (1-indexed)
     */
    public static playBuzzer(strikeCount: number = 1) {
        try {
            const ctx = this.getContext();
            
            // Resume context if suspended (browser security policy)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            // --- INTENSITY SCALING ---
            // Frequency (Pitch): 400Hz (Strike 1) to 1000Hz (Strike 8+)
            const frequency = Math.min(400 + (strikeCount - 1) * 85, 1200);
            
            // Duration: 0.2s (Strike 1) to 0.8s (Strike 8+)
            const duration = Math.min(0.2 + (strikeCount - 1) * 0.1, 1.5);
            
            // Waveform: 'sawtooth' for that urgent, "buzzing" feeling
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            // Volume Envelope: Sharp attack, slight decay
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2 + (strikeCount * 0.05), ctx.currentTime + 0.05); // LOUDER as strikes go up
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + duration);
        } catch (err) {
            console.warn("Audio Context Error: ", err);
        }
    }
}

export const playBuzzer = AudioProctor.playBuzzer.bind(AudioProctor);
