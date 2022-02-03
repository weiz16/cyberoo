import * as React from 'react';
import { UserIdentity } from 'services';

export interface IUserCardProps {
  user: UserIdentity;
}

export function UserCard (props: IUserCardProps) {
  const { user } = props;

  return (
    <div>
      {user?.domain}

      <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20">
      
      <div>
        <h2 className="text-gray-800 text-3xl font-semibold">{user.domain}</h2>
        <p className="mt-2 text-gray-600">
          {user.address}
        </p>
      </div>
      <div className="flex justify-start mt-4">
        Follower count {user?.followerCount}
      </div>
      <div className="flex justify-start mt-4">
        Follower count {user?.followingCount}
      </div>

    </div>

    </div>
  );
}
