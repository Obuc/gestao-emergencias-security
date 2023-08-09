import * as AvatarRadix from '@radix-ui/react-avatar';

interface IAvatarProps {
  image?: string;
  username: string;
}

const Avatar = ({ image, username }: IAvatarProps) => {
  const fullName = username.split(' ');
  const fallback = fullName[0][0] + fullName[1][0];

  return (
    <AvatarRadix.Root className="w-10 h-10 rounded-full select-none flex items-center justify-center">
      <AvatarRadix.Image
        className="w-full h-full object-cover rounded-full"
        src={image}
        alt={username}
      />
      <AvatarRadix.Fallback
        className="w-10 h-10 flex rounded-full items-center justify-center bg-white text-primary font-medium"
        delayMs={600}
      >
        {fallback}
      </AvatarRadix.Fallback>
    </AvatarRadix.Root>
  );
};

export default Avatar;
