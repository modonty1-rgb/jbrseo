'use client';

import NextLink, { type LinkProps as NextLinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { type FC, type HTMLAttributes, useCallback, useRef } from 'react';

type LinkProps = NextLinkProps & {
  children: React.ReactNode;
  href: string;
  target?: string;
} & HTMLAttributes<HTMLAnchorElement>;

const isExternal = (href: string): boolean =>
  href.startsWith('http') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:');

const Link: FC<LinkProps> = ({ children, href, ...rest }) => {
  const router = useRouter();
  const prefetchedRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (prefetchedRef.current || isExternal(href)) return;
    prefetchedRef.current = true;
    router.prefetch(href);
  }, [href, router]);

  if (isExternal(href)) {
    return (
      <a href={href} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} prefetch={false} onMouseEnter={handleMouseEnter} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;