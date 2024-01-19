import React, { useState, createContext, useEffect } from 'react'

export const UserUpdateContext = createContext({
  user: {},
  setUser: () => { }
});

const UserUpdateProvider = props => {

  const [user, setUser] = useState({});

  const newUser = (data) => {
    setUser({ ...user, data });
  }

  useEffect(() => {
    (async () => {
      if (process.browser) {
        if (localStorage.getItem('userCompany')) {
          newUser(localStorage.getItem('userCompany'));
        } else {
          newUser({});
        }
      }
    })()
  }, [])

  return (
    <UserUpdateContext.Provider value={{ user, newUser }}>
      {props.children}
    </UserUpdateContext.Provider>
  );
};

export default UserUpdateProvider;