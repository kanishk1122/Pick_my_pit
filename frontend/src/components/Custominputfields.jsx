import React, { useState } from "react";

const Custominputfields = ({ from, name, getter, setter, type , disabled }) => {
  const [Fieldfocus, setFieldfocus] = useState(false);

  return (
    <div className="relative w-full">
      <label
        htmlFor={from}
        className={`text-xl font-bold px-1 absolute duration-300 ${
          Fieldfocus || getter ? "translate-y-0" : "translate-y-11"
        }`}
      >
        {name}
      </label>
      <input
        type={type}
        id={from}
        value={getter}
        onChange={(e) => setter(e.target.value)}
        onFocus={() => setFieldfocus(true)}
        onBlur={() => !getter && setFieldfocus(false)}
        placeholder={Fieldfocus ? name : ""}
        disabled={disabled ? true : false}
        className="w-[100%] h-[50px] mt-8 border-2 border-black rounded-lg px-2 py-3 focus:ring-0 pr-10"
      />
    </div>
  );
};



const Passwordcustomfiled = ({ password, setPassword , name }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div className="relative w-full">
      <label
        htmlFor="password"
        className={`text-xl font-bold px-1 absolute duration-300 ${
          passwordFocused || password ? "translate-y-0" : "translate-y-11"
        }`}
      >
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setPasswordFocused(true)}
        onBlur={() => !password && setPasswordFocused(false)}
        placeholder={passwordFocused ? name : ""}
        className="w-full h-[50px] mt-8 border-2 border-black rounded-lg px-2 py-3 focus:ring-0 pr-10"
      />
      <div className="absolute right-3 top-11">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="flex justify-center items-center rounded-lg"
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M10.1305 15.8421L9.34268 18.7821L7.41083 18.2645L8.1983 15.3256C7.00919 14.8876 5.91661 14.2501 4.96116 13.4536L2.80783 15.6069L1.39362 14.1927L3.54695 12.0394C2.35581 10.6105 1.52014 8.8749 1.17578 6.96843L2.07634 6.80469C4.86882 8.81573 8.29618 10.0003 12.0002 10.0003C15.7043 10.0003 19.1316 8.81573 21.9241 6.80469L22.8247 6.96843C22.4803 8.8749 21.6446 10.6105 20.4535 12.0394L22.6068 14.1927L21.1926 15.6069L19.0393 13.4536C18.0838 14.2501 16.9912 14.8876 15.8021 15.3256L16.5896 18.2645L14.6578 18.7821L13.87 15.8421C13.2623 15.9461 12.6376 16.0003 12.0002 16.0003C11.3629 16.0003 10.7381 15.9461 10.1305 15.8421Z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export {Passwordcustomfiled}

export default Custominputfields;