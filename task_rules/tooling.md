# Tooling rules

Trigger: running shell commands or scripts on Windows, handling text that contains backslashes, or working on the pitch video.

## Windows (Claude Code's Bash tool runs Git Bash)
1. **Backslashes get mangled.** Inline Python or heredocs containing `\` (regexes, Windows paths, escape sequences) can arrive altered, and the damage only shows in the output file. Write such scripts or text to a file with the Write tool, then run the file. Never edit text containing backslashes with sed or a heredoc.
2. **Encoding.** Start Python scripts with `sys.stdout.reconfigure(encoding="utf-8")` so non-ASCII output doesn't crash the Windows console.
3. **Python.** Use `py`, not `python`. On David's machine `py -3.11` is the one with `imageio_ffmpeg`, `cv2` and `moviepy`.
4. **WSL from Git Bash.** `$VAR` and `/mnt/c/...` arguments get mangled inside `wsl -- bash -lc '...'`. Put the Linux commands in a script file and run `wsl -- bash -lc "bash /mnt/c/path/to/script.sh"`.
5. **PowerShell** is also available as its own tool and is the simplest choice for native Windows commands.

## Pitch video (mp4, mov or webm, max 500 MB, aim for 1 to 3 minutes)
1. ffmpeg is often not on PATH. Use the binary bundled with the `imageio-ffmpeg` Python package. On Windows, run `py -3.11 -c "import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())"`; elsewhere, use `python3`. Run `pip install imageio-ffmpeg` if it's missing (a small package). Below, `<ffmpeg>` is that path.
2. Inspect duration, streams and resolution: `<ffmpeg> -hide_banner -i pitch.mp4`.
3. Shrink below 500 MB: `<ffmpeg> -i in.mov -c:v libx264 -preset veryfast -crf 23 -c:a aac -b:a 128k -movflags +faststart pitch.mp4`. Raise `-crf` to 26 to 28 if it's still too big.
4. Find silent gaps: `<ffmpeg> -i pitch.mp4 -af silencedetect=n=-40dB:d=2.5 -vn -f null -`.
5. Grab a frame for a thumbnail: `<ffmpeg> -ss 00:00:05 -i pitch.mp4 -frames:v 1 thumb.png`.
6. Videos and race footage stay out of git; `footage/` is gitignored.
7. No speech-to-text model is installed. Ask before installing one (see `CLAUDE.md`, Installs).
