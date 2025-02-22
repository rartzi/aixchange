'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4 py-2">
          {/* Users Management */}
          <Link 
            href="/admin/users"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/users')}`}
          >
            Users
          </Link>

          {/* Solutions Management */}
          <Link 
            href="/admin/solutions/import"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/solutions/import')}`}
          >
            Import Solutions
          </Link>
          <Link 
            href="/admin/solutions/test-import"
            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin/solutions/test-import')}`}
          >
            Test Import
          </Link>
        </div>
      </div>
    </nav>
  );
}