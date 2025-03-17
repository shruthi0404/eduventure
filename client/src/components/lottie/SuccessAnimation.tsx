import { Player } from '@lottiefiles/react-lottie-player';

interface SuccessAnimationProps {
  width?: string;
  height?: string;
}

const SuccessAnimation = ({ width = "150px", height = "150px" }: SuccessAnimationProps) => {
  return (
    <Player
      autoplay
      loop={false}
      src="https://assets9.lottiefiles.com/packages/lf20_touohxv0.json"
      style={{ width, height, margin: '0 auto' }}
    />
  );
};

export default SuccessAnimation;
