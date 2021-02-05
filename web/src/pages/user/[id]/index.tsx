import { Button } from 'antd'
import React, { ReactElement, useContext } from 'react'
import '@/styles/header.less'
import { Context, IContext } from '@/components/layout/LayoutProvider'
import UserLayout from '@/components/UserLayout'
import { User } from '@/types'
import { GetServerSideProps } from 'next'
import { getUserById } from '@/lib/api'

interface Props {
  user: User
}

export default function UserPage({ user }: Props): ReactElement {
  const [state] = useContext(Context) as IContext
  const editable = state.user?.id === user.id
  return (
    <UserLayout>
      <p>{user?.name}</p>
      <p>{user?.email}</p>
      {editable ? <Button type="primary">保存</Button> : null}
    </UserLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query
  const user = await getUserById(id as string)
  return {
    props: {
      user,
    },
  }
}
