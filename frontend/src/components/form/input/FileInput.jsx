import { useState } from "react";
import { CloseLineIcon } from "../../../icons";

const FileInput = ({ className, onChange, hint, success = false, error = false, isRequired = false, name, accept="*" }) => {
  const [clear, setClear] = useState(false);
  return (
    <div className="relative">  
      <div className="relative">
      <input
        type="file"
        className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400 ${className}`}
        onChange={onChange}
        required={isRequired}
        name={name}
        accept={accept}
        />
        {hint && (
          <p
          className={`mt-1.5 text-xs ${
            error
            ? "text-error-500"
            : success
            ? "text-success-500"
            : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>

      <span
        onClick={() => setClear(!clear)}
        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/3"
      >
        <CloseLineIcon className="fill-gray dark:fill-gray-100 size-5" />
      </span>
    </div>
  );
};

export default FileInput;
