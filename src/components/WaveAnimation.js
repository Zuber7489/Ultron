import React from 'react';
import { motion } from 'framer-motion';

const WaveAnimation = ({ isActive }) => (
  <motion.div
    className="wave-animation"
    initial={{ scale: 0 }}
    animate={{ scale: isActive ? 1.1 : 0.9 }}
    transition={{ duration: 0.5, yoyo: Infinity }}
    style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(0, 123, 255, 0.6)' }}
  />
);

export default WaveAnimation;
