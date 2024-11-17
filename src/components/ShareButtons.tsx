import React from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round className="hover:scale-110 transition-transform" />
      </TwitterShareButton>
      
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={32} round className="hover:scale-110 transition-transform" />
      </FacebookShareButton>
      
      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={32} round className="hover:scale-110 transition-transform" />
      </LinkedinShareButton>
      
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round className="hover:scale-110 transition-transform" />
      </WhatsappShareButton>
    </div>
  );
}
