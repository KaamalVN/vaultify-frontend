"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function UploadProgress({ files, progress, errors }) {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Upload Progress</h3>

      {files.map((file, index) => {
        const fileProgress = progress[file.name] || 0
        const error = errors[file.name]
        const isComplete = fileProgress === 100 && !error

        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="font-medium truncate max-w-xs">{file.name}</span>
              </div>

              {isComplete && <CheckCircle className="text-green-500" size={18} />}

              {error && (
                <div className="flex items-center text-red-500">
                  <XCircle size={18} className="mr-1" />
                  <span className="text-sm">Failed</span>
                </div>
              )}

              {!isComplete && !error && fileProgress > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">{fileProgress.toFixed(0)}%</span>
              )}
            </div>

            {!isComplete && !error && (
              <motion.div
                className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${fileProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}

            {error && (
              <div className="mt-2 text-sm text-red-500 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
