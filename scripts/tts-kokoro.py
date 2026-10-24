# Speaks one line with Kokoro TTS (kokoro-onnx) and writes it as a WAV. Text comes on stdin.
#   python3 scripts/tts-kokoro.py MODEL.onnx VOICES.bin VOICE SPEED OUT.wav < line.txt
# Model files: https://github.com/thewh1teagle/kokoro-onnx/releases (kokoro-v1.0.onnx, voices-v1.0.bin).
import sys
import soundfile as sf
from kokoro_onnx import Kokoro

model, voices, voice, speed, out = sys.argv[1:6]
samples, sr = Kokoro(model, voices).create(sys.stdin.read().strip(), voice=voice, speed=float(speed), lang='en-us')
sf.write(out, samples, sr)
