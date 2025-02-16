import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard | AiXchange",
  description: "Your AiXchange dashboard",
}

export default function DashboardPage() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Welcome to AiXchange
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Your central hub for AI solutions. Start exploring or create your own
            solution to share with the community.
          </p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create New Solution
          </button>
        </div>
      </div>
    </div>
  )
}