import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black p-4">
      <div className='w-10'>
        {/* Logo as a link to the home page */}
        <Link href="/" className='w-fit-content'>
          <div>
            <Image src="/images/plumslogo.png" alt="PLuMS Logo" width={40} height={40} />
          </div>
        </Link>
      </div>
    </header>
  );
}
