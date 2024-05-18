import * as React from 'react';
import Stack from '@mui/joy/Stack';
import CircularProgress from '@mui/joy/CircularProgress';

export default function CircularProgressCountUp({ progress }: { progress: number }) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1000; // Animation duration in milliseconds
    const easeOutQuad = (t: number) => t * (2 - t);

    const animateValue = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const percentage = easeOutQuad(elapsed / duration);
      setValue(percentage * progress);

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animateValue);
      }
    };

    animationFrameId = requestAnimationFrame(animateValue);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress]);

  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={8}>
      <Stack spacing={2}>
        <CircularProgress
          variant='solid'
          sx={{
            "--CircularProgress-trackColor": "#222831",
            "--CircularProgress-size": "70px",
            "--CircularProgress-progressColor": "rgba(99, 102, 241, 1)",
            "--CircularProgress-trackThickness": "11px"
          }}
          color="primary"
          size="lg"
          determinate
          value={value}
        >
          <div className='text-white opacity-70 font-bold text-[14px]'>
            {Math.round(value)}%
          </div>
        </CircularProgress>
      </Stack>
    </Stack>
  );
}