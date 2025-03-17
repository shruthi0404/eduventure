import { Player } from '@lottiefiles/react-lottie-player';

const LoginBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Player
        autoplay
        loop
        src="https://assets8.lottiefiles.com/packages/lf20_c1hgjefo.json"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LoginBackground;
