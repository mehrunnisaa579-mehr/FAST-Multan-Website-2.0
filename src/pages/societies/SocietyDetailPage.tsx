import React from 'react';
import { useParams } from 'react-router-dom';
import SocietyView from '../../components/societies/SocietyView';

export default function SocietyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  return <SocietyView slug={slug} />;
}
