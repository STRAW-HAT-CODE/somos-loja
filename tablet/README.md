# Tablet QR landing canvas

Serve this static directory locally with:

```sh
cd tablet
python3 -m http.server 4326
```

Open `http://localhost:4326/`. The courier invitation link defaults to `http://localhost:4325/`; replace `COURIER_INVITATION_URL` in `index.html` when the public URL is available.

The plaza video was supplied by the client. `recursos/plaza.mp4` is a muted, cropped, sepia-graded forward-and-reverse loop; `recursos/plaza.jpg` is its still poster. Only the two locally bundled font files are used.
