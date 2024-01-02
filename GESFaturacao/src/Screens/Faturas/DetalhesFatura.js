import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../../Context/AuthContext';

export default function DetalhesFatura({ navigation }) {
    const { getFaturaById } = useContext(AuthContext);
    
}