// src/services/api.js
// API service for job applications

// Mock API service - in a real app, this would make actual HTTP requests
const mockJobs = []

export const jobsAPI = {
  // Get all jobs
  getAll: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return { data: mockJobs }
  },

  // Create a new job
  create: async (jobData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newJob = {
      _id: Date.now().toString(),
      ...jobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockJobs.unshift(newJob)
    return { data: { job: newJob } }
  },

  // Update a job
  update: async (jobId, jobData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockJobs.findIndex(job => job._id === jobId)
    if (index === -1) {
      throw new Error('Job not found')
    }
    mockJobs[index] = {
      ...mockJobs[index],
      ...jobData,
      updatedAt: new Date().toISOString()
    }
    return { data: { job: mockJobs[index] } }
  },

  // Delete a job
  delete: async (jobId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockJobs.findIndex(job => job._id === jobId)
    if (index === -1) {
      throw new Error('Job not found')
    }
    mockJobs.splice(index, 1)
    return { data: { success: true } }
  },

  // Get a single job
  getById: async (jobId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const job = mockJobs.find(job => job._id === jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return { data: { job } }
  }
}

export default jobsAPI
