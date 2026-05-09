const Cabin3DViewer = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        title="Cabin 3D Viewer"
        src="https://sketchfab.com/models/e1f1fea95f41427b9fef55d0d145490d/embed?autostart=1&ui_theme=dark&dnt=1"
        className="w-full h-full"
        frameBorder={0}
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default Cabin3DViewer;
