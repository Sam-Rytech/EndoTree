import Header from '../../components/Header'

export default function ProfileLayout({ children }) {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </>
  )
}
