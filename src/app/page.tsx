import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Play,
  Star,
  Target,
  Users,
  Zap,
} from "lucide-react";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                  🚀 Transform Your Skills Today
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Master New Skills with{" "}
                <span className="text-blue-600">skillEd</span>
          </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Join thousands of learners worldwide in our comprehensive
                e-learning platform. From programming to design, business to
                science - unlock your potential with expert-led courses and
                hands-on projects.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-300"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-200 hover:border-blue-300 hover:text-blue-600"
                >
                  Explore Courses
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>10K+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>500+ Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>4.8/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 shadow-2xl">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20" />
                <div className="relative">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/20 p-2">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Web Development
                        </h3>
                        <p className="text-blue-100">React & Next.js</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">85%</div>
                      <div className="text-sm text-blue-100">Complete</div>
                    </div>
                  </div>

                  <div className="mb-4 h-3 rounded-full bg-white/20">
                    <div
                      className="h-3 rounded-full bg-white"
                      style={{ width: "85%" }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/10 p-3 text-center">
                      <div className="text-lg font-bold text-white">12</div>
                      <div className="text-xs text-blue-100">Lessons</div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3 text-center">
                      <div className="text-lg font-bold text-white">8</div>
                      <div className="text-xs text-blue-100">Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose skillEd?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our platform is designed to provide the best learning experience
              possible
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Expert-Led Courses
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals and certified instructors with
                real-world experience.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Hands-On Projects
              </h3>
              <p className="text-gray-600">
                Apply your knowledge with practical projects and build a
                portfolio of real work.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Flexible Learning
              </h3>
              <p className="text-gray-600">
                Study at your own pace with 24/7 access to course materials and
                resources.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Community Support
              </h3>
              <p className="text-gray-600">
                Connect with fellow learners, share experiences, and get help
                when you need it.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-red-100">
                <Award className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Certificates
              </h3>
              <p className="text-gray-600">
                Earn recognized certificates upon completion to showcase your
                new skills.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-100">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and
                progress insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Popular Learning Categories
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover courses in high-demand fields
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                name: "Programming",
                icon: "💻",
                color: "bg-blue-100 text-blue-800",
                count: "150+ courses",
              },
              {
                name: "Design",
                icon: "🎨",
                color: "bg-purple-100 text-purple-800",
                count: "80+ courses",
              },
              {
                name: "Business",
                icon: "💼",
                color: "bg-green-100 text-green-800",
                count: "120+ courses",
              },
              {
                name: "Marketing",
                icon: "📈",
                color: "bg-yellow-100 text-yellow-800",
                count: "90+ courses",
              },
              {
                name: "Science",
                icon: "🔬",
                color: "bg-red-100 text-red-800",
                count: "70+ courses",
              },
              {
                name: "Language",
                icon: "🌍",
                color: "bg-indigo-100 text-indigo-800",
                count: "60+ courses",
              },
              {
                name: "Music",
                icon: "🎵",
                color: "bg-pink-100 text-pink-800",
                count: "40+ courses",
              },
              {
                name: "Art",
                icon: "🎭",
                color: "bg-orange-100 text-orange-800",
                count: "50+ courses",
              },
            ].map((category) => (
              <div
                key={category.name}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-3 text-4xl">{category.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.count}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/explore"
              className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700"
            >
              Explore All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Join thousands of learners who have already transformed their
            careers with skillEd
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-200 hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-white hover:text-blue-600"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-2xl font-bold text-white">skillEd</h3>
              <p className="mt-4 text-gray-400">
                Empowering learners worldwide with quality education and
                practical skills.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Platform</h4>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/explore"
                    className="transition-colors hover:text-white"
                  >
                    Explore Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="transition-colors hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analytics"
                    className="transition-colors hover:text-white"
                  >
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="transition-colors hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="transition-colors hover:text-white"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="transition-colors hover:text-white"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 skillEd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
